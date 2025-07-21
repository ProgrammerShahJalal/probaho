import {
    DataTypes,
    Model,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';

const tableName = 'academic_batch_id_rules';
const modelName = 'AcademicBatchIdRuleModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;

type status = 'active' | 'deactive';


class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;

    declare branch_user_id: number[];
    declare branch_id: number[];
    declare academic_year_id: number[];
    declare title: string;
    declare description?: string;
    declare value: string;
    
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
            branch_user_id: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            branch_id: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            academic_year_id: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            value: {
                type: DataTypes.STRING,
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
