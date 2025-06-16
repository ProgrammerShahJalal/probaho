import {
    DataTypes,
    Model,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';

const tableName = 'events';
const modelName = 'EventModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;
type status = 'active' | 'deactive';
type eventType = 'online' | 'offline';

class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;

    declare title: string;

    declare reg_start_date: string;
    declare reg_end_date: string;

    declare session_start_date_time: string;
    declare session_end_date_time: string;

    declare place: string;
    declare short_description: string;
    declare full_description: string;
    declare pre_requisities: string;
    declare terms_and_conditions: string;

    declare event_type: eventType;
    declare poster: string;

    declare price: number;
    declare discount_price: number;

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
            title: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            reg_start_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            reg_end_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            session_start_date_time: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            session_end_date_time: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            place: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            short_description: {
                type: DataTypes.STRING(1000),
                allowNull: true,
            },
            full_description: {
                type: DataTypes.TEXT(),
                allowNull: true,
            },

            pre_requisities: {
                type: DataTypes.STRING(1000),
                allowNull: true,
            },
            terms_and_conditions: {
                type: DataTypes.TEXT(),
                allowNull: true,
            },
            event_type: {
                type: DataTypes.ENUM(
                    'online',
                    'offline',
                )
            },
            poster: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            discount_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },


            status: {
                type: new DataTypes.ENUM('active', 'deactive',),

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

export { init, DataModel, modelName, tableName }; // export the function and the model
