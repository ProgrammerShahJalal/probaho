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

export const tableName = 'app_setting_values';
export const modelName = 'AppSettingValuesModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;
type status = 'active' | 'deactive';
type type = 'text' | 'number' | 'file' | "text editor";

class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;

    declare app_setting_key_id: number;
    declare title: string;
    declare value: string;
    declare is_default: boolean;
    declare type: type;


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
            app_setting_key_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            value: {
                type: DataTypes.TEXT(),
                allowNull: true,
            },
            is_default: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            type: {
                type: DataTypes.ENUM('text', 'number', 'file', 'text editor'),
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

export { init, DataModel };
