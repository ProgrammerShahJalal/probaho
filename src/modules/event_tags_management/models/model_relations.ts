import Models from '../../../database/models';

export async function init() {
    const models = await Models.get();
    if (!models.EventModel || !models.EventTagsModel) {
        console.error(
            'EventModel or EventTagsModel is undefined. Ensure model initialization before calling init().',
        );
        return;
    }

    // Define the association with EventModel
    models.EventTagsModel.belongsToMany(models.EventModel, {
        as: 'tag_events',
        through: 'event_tag_event',
        otherKey: 'event_tag_id',
        foreignKey: 'event_id',
    });

    // models.EventTagsModel.belongsTo(models.EventModel, {
    //     as: 'tag_event',
    //     foreignKey: 'event_id',
    // });

    console.log(
        'Event Tag management relation models initialized successfully',
    );
}
