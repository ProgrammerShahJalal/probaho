import {
    DataTypes,
    Model,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';

const tableName = 'user_login_histories';
const modelName = 'UserLoginHistoriesModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;

type status = 'active' | 'deactive';


class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;
    declare user_id: number; 
    declare login_date: Date | null;
    declare logout_date: Date | null;
    declare device: string;
    declare total_session_time: number;

    declare status?: status;
    declare created_at?: CreationOptional<Date>;
    declare updated_at?: CreationOptional<Date>;
}

function init(sequelize: Sequelize) {
    DataModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                },
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            login_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            logout_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            device: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            total_session_time: {
                type: DataTypes.INTEGER, // Store session duration in seconds
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('active', 'deactive'),
                defaultValue: 'active'
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: tableName,
            modelName: modelName,
            sequelize, // Passing the `sequelize` instance is required
            underscored: true,
        },
    );

    return DataModel;
}

export { init, DataModel, modelName };
