import { FastifyInstance } from 'fastify';
import Models from '../../../database/models';
import { modelName } from '../models/model';
import custom_error from '../../../helpers/custom_error';

interface WebhookMetadata {
    user_id: string;
    event_id: string;
    event_enrollment_id: string;
    trx_id: string;
}

export async function handleSuccessfulPayment(
    fastify_instance: FastifyInstance,
    session_id: string,
    metadata: WebhookMetadata
): Promise<void> {
    console.log('=== HANDLE SUCCESSFUL PAYMENT ===');
    console.log('Session ID:', session_id);
    console.log('Metadata:', JSON.stringify(metadata, null, 2));
    
    const models = Models.get();
    
    try {
        const { user_id, event_id, event_enrollment_id, trx_id } = metadata;
        
        // Validate metadata fields
        if (!user_id || !event_id || !event_enrollment_id || !trx_id) {
            throw new Error(`Invalid metadata: missing required fields. Got: ${JSON.stringify(metadata)}`);
        }

        console.log('Parsed metadata:', {
            user_id,
            event_id,
            event_enrollment_id: parseInt(event_enrollment_id),
            trx_id
        });

        // Parse enrollment ID to number and validate
        const enrollmentId = parseInt(event_enrollment_id);
        if (isNaN(enrollmentId)) {
            throw new Error(`Invalid event_enrollment_id: ${event_enrollment_id} is not a valid number`);
        }

        // Start a transaction for data consistency
        const transaction = await (models as any).sequelize.transaction();
        
        try {
            // Check if enrollment exists
            const existingEnrollment = await models.EventEnrollmentsModel.findOne({
                where: { id: enrollmentId },
                transaction
            });

            console.log('Existing enrollment:', existingEnrollment?.toJSON());

            if (!existingEnrollment) {
                throw new Error(`Enrollment not found with ID: ${enrollmentId}`);
            }

            // Check current enrollment status
            console.log('Current enrollment status:', {
                is_paid: existingEnrollment.is_paid,
                status: existingEnrollment.status
            });

            // Update enrollment with explicit values
            const [enrollmentUpdateCount] = await models.EventEnrollmentsModel.update(
                { 
                    is_paid: '1', 
                    status: 'accepted',
                    updated_at: new Date()
                },
                { 
                    where: { id: enrollmentId },
                    transaction
                }
            );

            console.log('Enrollment update count:', enrollmentUpdateCount);

            if (enrollmentUpdateCount === 0) {
                throw new Error(`Failed to update enrollment with ID: ${enrollmentId}`);
            }

            // Check if payment record exists
            const existingPayment = await models.EventPaymentsModel.findOne({
                where: { session_id: session_id },
                transaction
            });

            console.log('Existing payment:', existingPayment?.toJSON());

            if (!existingPayment) {
                throw new Error(`Payment record not found with session ID: ${session_id}`);
            }

            // Check current payment status
            console.log('Current payment status:', existingPayment.status);

            // Update payment record
            const [paymentUpdateCount] = await models.EventPaymentsModel.update(
                { 
                    status: 'success',
                    updated_at: new Date()
                },
                { 
                    where: { session_id: session_id },
                    transaction
                }
            );

            console.log('Payment update count:', paymentUpdateCount);

            if (paymentUpdateCount === 0) {
                throw new Error(`Failed to update payment with session ID: ${session_id}`);
            }

            // Commit transaction
            await transaction.commit();

            // Verify updates after commit
            const updatedEnrollment = await models.EventEnrollmentsModel.findOne({
                where: { id: enrollmentId }
            });
            
            const updatedPayment = await models.EventPaymentsModel.findOne({
                where: { session_id: session_id }
            });

            console.log('Final verification - Updated enrollment:', {
                id: updatedEnrollment?.id,
                is_paid: updatedEnrollment?.is_paid,
                status: updatedEnrollment?.status
            });
            
            console.log('Final verification - Updated payment:', {
                id: updatedPayment?.id,
                session_id: updatedPayment?.session_id,
                status: updatedPayment?.status
            });

            console.log(`✅ Successfully processed payment for enrollment ${enrollmentId}`);
            
        } catch (transactionError) {
            // Rollback transaction on error
            await transaction.rollback();
            throw transactionError;
        }
        
    } catch (error: any) {
        console.error('❌ Error in handleSuccessfulPayment:', error.message);
        console.error('Error stack:', error.stack);
        throw new custom_error('webhook processing error', 500, error.message);
    }
}

export async function handleFailedPayment(
    fastify_instance: FastifyInstance,
    session_id: string,
): Promise<void> {
    const models = Models.get();
    
    try {
        // Update payment record status to failed
        await models[modelName].update(
            { 
                status: 'failed',
                // failure_reason: reason,
                updated_at: new Date()
            },
            { 
                where: { 
                    session_id: session_id 
                } 
            }
        );

        // Optionally, you might want to update enrollment status too
        // For now, keeping enrollment as pending allows user to retry payment
        
        // console.log(`Payment session ${session_id} marked as ${reason}`);
    } catch (error: any) {
        console.error('Error in handleFailedPayment:', error);
        throw new custom_error('webhook processing error', 500, error.message);
    }
}

export async function handleCancelledPayment(
    fastify_instance: FastifyInstance,
    session_id: string
): Promise<void> {
    const models = Models.get();
    
    try {
        // Find the payment record
        const paymentRecord = await models[modelName].findOne({
            where: { session_id: session_id }
        });

        if (paymentRecord) {
            // Update payment status to cancelled
            await models[modelName].update(
                { 
                    status: 'failed',
                    updated_at: new Date()
                },
                { 
                    where: { 
                        session_id: session_id 
                    } 
                }
            );

            // Keep enrollment as pending so user can retry
            console.log(`Payment session ${session_id} marked as cancelled`);
        }
    } catch (error: any) {
        console.error('Error in handleCancelledPayment:', error);
        throw new custom_error('webhook processing error', 500, error.message);
    }
}