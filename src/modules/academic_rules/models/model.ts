import {
    DataTypes,
    Model,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';

const tableName = 'academic_rules';
const modelName = 'AcademicRulesModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;

type status = 'active' | 'deactive';

class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;

    declare branch_user_id: number[] | string; // Store as JSON array of numbers
    declare branch_id: number[] | string;
    declare academic_year_id: number[] | string;
    declare academic_rules_types_id: number[] | string; // Store as JSON array of numbers
    declare title: string;
    declare date: Date;
    declare description: string;
    declare file?: string | object; // Optional file field (can store JSON)

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
                // Store as TEXT for JSON array of numbers (e.g., "[1,2,3]")
                type: DataTypes.TEXT,
                allowNull: false,
                get() {
                    const raw = this.getDataValue('branch_user_id');
                    if (typeof raw === 'string') {
                        try {
                            return JSON.parse(raw);
                        } catch {
                            return raw;
                        }
                    }
                    return raw;
                },
                set(val: number[] | string) {
                    if (Array.isArray(val)) {
                        this.setDataValue('branch_user_id', JSON.stringify(val));
                    } else {
                        this.setDataValue('branch_user_id', val);
                    }
                },
            },
            branch_id: {
                // Store as TEXT for JSON array of numbers (e.g., "[1,2,3]")
                type: DataTypes.TEXT,
                allowNull: false,
                get() {
                    const raw = this.getDataValue('branch_id');
                    if (typeof raw === 'string') {
                        try {
                            return JSON.parse(raw);
                        } catch {
                            return raw;
                        }
                    }
                    return raw;
                },
                set(val: number[] | string) {
                    if (Array.isArray(val)) {
                        this.setDataValue('branch_id', JSON.stringify(val));
                    } else {
                        this.setDataValue('branch_id', val);
                    }
                },
            },
            academic_year_id: {
                // Store as TEXT for JSON array of numbers (e.g., "[1,2,3]")
                type: DataTypes.TEXT,
                allowNull: false,
                get() {
                    const raw = this.getDataValue('academic_year_id');
                    if (typeof raw === 'string') {
                        try {
                            return JSON.parse(raw);
                        } catch {
                            return raw;
                        }
                    }
                    return raw;
                },
                set(val: number[] | string) {
                    if (Array.isArray(val)) {
                        this.setDataValue('academic_year_id', JSON.stringify(val));
                    } else {
                        this.setDataValue('academic_year_id', val);
                    }
                },
            },
            academic_rules_types_id: {
                // Store as TEXT for JSON array of numbers (e.g., "[1,2,3]")
                type: DataTypes.TEXT,
                allowNull: false,
                get() {
                    const raw = this.getDataValue('academic_rules_types_id');
                    if (typeof raw === 'string') {
                        try {
                            return JSON.parse(raw);
                        } catch {
                            return raw;
                        }
                    }
                    return raw;
                },
                set(val: number[] | string) {
                    if (Array.isArray(val)) {
                        this.setDataValue('academic_rules_types_id', JSON.stringify(val));
                    } else {
                        this.setDataValue('academic_rules_types_id', val);
                    }
                },
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            file: {
                // Store as TEXT for JSON file metadata
                type: DataTypes.TEXT,
                allowNull: true,
                get() {
                    const raw = this.getDataValue('file');
                    if (typeof raw === 'string') {
                        try {
                            return JSON.parse(raw);
                        } catch {
                            return raw;
                        }
                    }
                    return raw;
                },
                set(val: string | object) {
                    if (typeof val === 'object') {
                        this.setDataValue('file', JSON.stringify(val));
                    } else {
                        this.setDataValue('file', val);
                    }
                },
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
