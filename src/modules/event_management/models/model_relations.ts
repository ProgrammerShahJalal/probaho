import { Sequelize } from 'sequelize';
import Models from '../../../database/models';

export async function init() {
    const models = await Models.get(); // Ensure models are fully initialized

    if (!models.EventModel || !models.EventCategoriesModel) {
        console.error(
            'EventModel or EventCategoriesModel is undefined. Ensure model initialization before calling init().',
        );
        return;
    }

    models.EventModel.hasMany(models.EventCategoryEventModel, {
        foreignKey: 'event_id',
        sourceKey: 'id',
        as: 'event_categories',
    });
    models.EventModel.hasMany(models.EventTagEventModel, {
        foreignKey: 'event_id',
        sourceKey: 'id',
        as: 'event_tags',
    });

    models.EventModel.belongsToMany(models.EventCategoriesModel, {
        as: 'event_categories_cat',
        through: 'event_category_event',
        foreignKey: 'event_id',
        otherKey: 'event_category_id',
    });
    models.EventModel.belongsToMany(models.EventTagsModel, {
        as: 'event_tags_tag',
        through: 'event_tag_event',
        foreignKey: 'event_id',
        otherKey: 'event_tag_id',
    });

    console.log('Event management relation models initialized successfully');
}
