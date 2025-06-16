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

export const tableName = 'event_enrollments';
export const modelName = 'EventEnrollmentsModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;
type status = 'pending' | 'accepted' | 'rejected';
type is_paid = '0' | '1';

class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;

    declare event_id: number;
    declare user_id: number;
    declare date: string;
    declare is_paid: is_paid;

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
            date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            is_paid: {
                type: new DataTypes.ENUM('0', '1'),
                defaultValue: '0',
            },

            status: {
                type: new DataTypes.ENUM('pending', 'accepted', 'rejected'),

                defaultValue: 'pending',
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
