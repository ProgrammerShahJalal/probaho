import Models from '../../../database/models';

export async function init() {
    const models = await Models.get();

    if (!models.EventModel || !models.EventCategoriesModel) {
        console.error(
            'EventModel or EventCategoriesModel is undefined. Ensure model initialization before calling init().',
        );
        return;
    }
    // Define the association with EventModel
    models.EventCategoriesModel.belongsToMany(models.EventModel, {
        as: 'category_events',
        through: 'event_category_event',
        foreignKey: 'event_category_id', // This should match event_category_event table
        otherKey: 'event_id',
    });

    models.EventCategoryEventModel.belongsTo(models.EventModel, {
        foreignKey: 'event_id',
        as: 'event',
    });
    console.log(
        'Event Categories management relation models initialized successfully',
    );
}
