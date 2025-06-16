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

export const tableName = 'event_certified_users';
export const modelName = 'EventCertifiedUsersModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;
type IsSubmitted = '1' | '0';
type status = 'active' | 'deactive';

class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;

    declare user_id?: number;
    declare event_id: number;
    declare scores: number;
    declare grade: string;
    declare date: string;
    declare is_submitted: IsSubmitted;
    declare image: string;

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

            user_id: {
                type: DataTypes.BIGINT().UNSIGNED,
                allowNull: true,
            },
            event_id: {
                type: DataTypes.BIGINT().UNSIGNED,
                allowNull: true,
            },
            scores: {
                type: DataTypes.INTEGER(),
                allowNull: true,
            },
            grade: {
                type: DataTypes.STRING(),
                allowNull: true,
            },
            date: {
                type: DataTypes.STRING(),
                allowNull: true,
            },
            is_submitted: {
                type: DataTypes.ENUM('1', '0'),
                defaultValue: '0',
            },
            image: {
                type: DataTypes.STRING(),
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
