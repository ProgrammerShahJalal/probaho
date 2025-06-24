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
type approved = '0' | '1';
type blocked = '0' | '1';
type status = 'active' | 'deactive';

class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;
    declare uid?: string;
    declare branch_id?: number;
    declare class_id?: number;
    declare role_serial?: number;
    declare is_approved?: approved;
    declare name: string;
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
    declare user_infos?: string | null;
    declare user_documents?: string | null;
    declare join_date?: Date | null;
    declare base_salary?: number | null;

    declare status?: status;
    declare created_at?: CreationOptional<Date>;
    declare updated_at?: CreationOptional<Date>;
    declare deleted_at?: CreationOptional<Date>;
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
            branch_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },
            class_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },

            role_serial: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            is_approved: {
                type: DataTypes.ENUM('0', '1'),
                allowNull: false,
                defaultValue: '0',
            },
            name: {
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
            user_infos: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            user_documents: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            join_date: {
                type: DataTypes.DATEONLY, // Store only the date, no time or timezone
                allowNull: true,
            },
            base_salary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
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
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: tableName,
            modelName: modelName,
            sequelize, // Passing the `sequelize` instance is required
            underscored: true,
            paranoid: true,
        },
    );

    return DataModel;
}

export { init, DataModel, modelName };
