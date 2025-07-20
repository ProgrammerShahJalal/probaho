import {
    DataTypes,
    Model,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';

const tableName = 'branch_infos';
const modelName = 'BranchInfosModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;

type status = 'active' | 'deactive';


class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;
    declare user_id: number;
    declare branch_code: string;
    declare name: string;
    declare logo: string;
    declare address: string;
    declare primary_contact: string;
    declare email: string;
    declare map?: string | null;
    declare lat?: number | null;
    declare lng?: number | null;
    declare infos?: string | null;

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
            user_id: {
                type: DataTypes.INTEGER,
            },
            branch_code: {
                type: DataTypes.STRING,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
            },
            logo: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            },
            primary_contact: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            map: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lat: {
                type: DataTypes.DECIMAL(10, 8),
                allowNull: true,
            },
            lng: {
                type: DataTypes.DECIMAL(11, 8),
                allowNull: true,
            },
            infos: {
                type: DataTypes.TEXT,
                allowNull: true,
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
