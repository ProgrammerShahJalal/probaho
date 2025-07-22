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

// Helper function for JSON array fields
function jsonArrayField() {
    return {
        type: DataTypes.TEXT,
        allowNull: false,
        get(this: any): any[] {
            const raw = this.getDataValue(this.name);
            if (typeof raw === 'string') {
                try {
                    const parsed = JSON.parse(raw);
                    return Array.isArray(parsed) ? parsed : [];
                } catch {
                    return [];
                }
            }
            return Array.isArray(raw) ? raw : [];
        },
        set(this: any, val: number[] | string) {
            if (Array.isArray(val)) {
                this.setDataValue(this.name, JSON.stringify(val));
            } else if (typeof val === 'string') {
                try {
                    const parsed = JSON.parse(val);
                    this.setDataValue(this.name, Array.isArray(parsed) ? val : '[]');
                } catch {
                    this.setDataValue(this.name, '[]');
                }
            } else {
                this.setDataValue(this.name, '[]');
            }
        }
    };
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
                ...jsonArrayField(),
                allowNull: false,
            },
            branch_id: {
                ...jsonArrayField(),
                allowNull: false,
            },
            academic_year_id: {
                ...jsonArrayField(),
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
            sequelize,
            underscored: true,
            paranoid: true,
        },
    );

    return DataModel;
}

export { init, DataModel, modelName };
