import {
    DataTypes,
    Model,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';

const tableName = 'users';
const modelName = 'UserModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;

type verified = '0' | '1';
type blocked = '0' | '1';
type status = 'active' | 'deactive';

class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;
    declare uid?: string;
    declare role_serial?: number;
    declare first_name: string;
    declare last_name: string;
    declare email: string;
    declare phone_number: string;
    declare photo?: string | null;
    declare password: string;
    declare slug: string;
    declare token: string;
    declare auth_code?: string | null;
    declare forget_code?: string | null;
    declare forget_code_expiry?: Date | null;
    user_agent?: string;
    declare is_verified?: verified;
    declare count_wrong_attempts?: number;
    declare is_blocked?: blocked;

    declare status?: status;
    declare created_at?: CreationOptional<Date>;
    declare updated_at?: CreationOptional<Date>;
}

function init(sequelize: Sequelize) {
    DataModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            uid: {
                type: new DataTypes.STRING(20),
                allowNull: true,
            },

            role_serial: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            first_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            phone_number: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            photo: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            token: {
                type: new DataTypes.STRING(100),
                allowNull: true,
            },
            auth_code: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            forget_code: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            forget_code_expiry: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            user_agent: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            is_verified: {
                type: DataTypes.ENUM('0', '1'),
                allowNull: false,
                defaultValue: '0',
            },
            count_wrong_attempts: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            is_blocked: {
                type: DataTypes.ENUM('0', '1'),
                allowNull: false,
                defaultValue: '0',
            },
            status: {
                type: DataTypes.ENUM('active', 'deactive'),
                defaultValue: 'active',
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
