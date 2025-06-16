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

export const tableName = 'event_sessions_assesments';
export const modelName = 'EventSessionsAssesmentsModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;
type status = 'active' | 'deactive';

class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;

    declare event_id: number;
    declare event_session_id: number;
    declare title: string;
    declare description: string;
    declare mark: number;
    declare pass_mark: number;
    declare start: string;
    declare end: string;

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
            event_session_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT(),
                allowNull: true,
            },
            mark: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            pass_mark: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            start: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            end: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            status: {
                type: new DataTypes.ENUM('active', 'deactive'),

                defaultValue: 'active',
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
