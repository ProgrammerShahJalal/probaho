import {
    // Association,
    DataTypes,
    // HasManyAddAssociationMixin,
    // HasManyCountAssociationsMixin,
    // HasManyCreateAssociationMixin,
    // HasManyGetAssociationsMixin,
    // HasManyHasAssociationMixin,
    // HasManySetAssociationsMixin,
    // HasManyAddAssociationsMixin,
    // HasManyHasAssociationsMixin,
    // HasManyRemoveAssociationMixin,
    // HasManyRemoveAssociationsMixin,
    Model,
    // ModelDefined,
    // Optional,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';

export const tableName = 'event_payments';
export const modelName = 'EventPaymentsModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;
type status = 'success' | 'failed';
type media = 'Stripe' | 'Manual';

class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;

    declare event_id: number;
    declare user_id: number;
    declare event_enrollment_id?: number;
    declare event_payment_id?: number;
    declare date: string;
    declare amount: number;
    declare trx_id: string;
    declare media: media;
    declare session_id: string;
    declare is_refunded?: boolean;

    declare status?: status;
    declare creator?: number;

    declare created_at?: CreationOptional<Date>;
    declare updated_at?: CreationOptional<Date>;
}

function init(sequelize: Sequelize) {
    DataModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            event_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            event_enrollment_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            event_payment_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            date: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            trx_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            media: {
                type: DataTypes.ENUM('Stripe', 'Manual'),
                defaultValue: 'Stripe',
            },
            session_id: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            is_refunded: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            status: {
                type: new DataTypes.ENUM('success', 'failed'),
                defaultValue: 'success',
            },

            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: tableName,
            modelName: modelName,
            sequelize, // passing the `sequelize` instance is required
            underscored: true,
        },
    );

    return DataModel;
}

export { init, DataModel };
