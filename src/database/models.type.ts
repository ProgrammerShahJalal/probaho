import * as EventModel from "../modules/event_management/models/model";
import * as EventCategoriesModel from "../modules/event_categories_management/models/model";
import * as EventCategoryEventModel from "../modules/event_categories_management/models/event_category_event.model";
import * as EventTagsModel from "../modules/event_tags_management/models/model";
import * as EventTagEventModel from "../modules/event_tags_management/models/event_tag_event.model";
import * as EventCertifiedUsersModel from "../modules/event_certified_users_management/models/model";
import * as EventResourcesModel from "../modules/event_resources_management/models/model";
import * as EventFaqsModel from "../modules/event_faqs_management/models/model";
import * as EventSessionsModel from "../modules/event_sessions_management/models/model";
import * as EventSessionsAssesmentsModel from "../modules/event_session_assesments_management/models/model";
import * as EventSessionAssesmentSubmissionsModel from "../modules/event_session_assesment_submissions_management/models/model";
import * as EventAttendanceModel from "../modules/event_attendance_management/models/model";
import * as EventEnrollmentsModel from "../modules/event_enrollments_management/models/model";
import * as EventPaymentsModel from "../modules/event_payments_management/models/model";
import * as EventPaymentRefundsModel from "../modules/event_payment_refunds_management/models/model";
import * as EventFeedbackFormFieldsModel from "../modules/event_feedback_form_fields_management/models/model";
import * as EventFeedbackFormFieldValuesModel from "../modules/event_feedback_form_field_values_management/models/model";
 
import * as ErrorTraceModel from "../modules/system_management/models/error_trace.model";
import * as ContactModel from "../modules/contact_management/models/model";

import * as BlogModel from "../modules/blog_management/models/model";
import * as BlogCategoriesModel from "../modules/blog_categories_management/models/model";
import * as BlogCategoryBlogModel from "../modules/blog_categories_management/models/blog_category_blog.model";
import * as BlogTagsModel from "../modules/blog_tags_management/models/model";
import * as BlogTagBlogModel from "../modules/blog_tags_management/models/blog_tag_blog.model";

import * as BlogCommentModel from "../modules/blog_comment_management/models/model";
import * as BlogCommentRepliesModel from "../modules/blog_comment_reply_management/models/model";
import * as BlogLikeModel from "../modules/blog_likes_management/models/model";
import * as BlogViewModel from "../modules/blog_view_management/models/model";

import * as AuthorModel from "../modules/author_management/models/model";

import * as DonationModel from "../modules/donation_management/models/model";

import * as AppSettingsModel from "../modules/app_setting_management/models/model";
import * as AppSettingValuesModel from "../modules/app_setting_values_management/models/model";
import * as AppSubscribersModel from "../modules/app_subscribers_management/models/model";

import * as UserModel from "../modules/authetication/models/user_model";
import * as UserRolesModel from "../modules/user_roles/models/model";
import * as UserLoginHistoriesModel from "../modules/user_login_histories/models/model";


export type model_types = {
    ContactModel: typeof ContactModel.DataModel;
    ErrorTraceModel: typeof ErrorTraceModel.DataModel;

    EventModel: typeof EventModel.DataModel;
    EventCategoriesModel: typeof EventCategoriesModel.DataModel;
    EventCategoryEventModel: typeof EventCategoryEventModel.DataModel;
    EventTagsModel: typeof EventTagsModel.DataModel;
    EventTagEventModel: typeof EventTagEventModel.DataModel;
    EventCertifiedUsersModel: typeof EventCertifiedUsersModel.DataModel;
    EventResourcesModel: typeof EventResourcesModel.DataModel;
    EventFaqsModel: typeof EventFaqsModel.DataModel;
    EventSessionsModel: typeof EventSessionsModel.DataModel;
    EventSessionsAssesmentsModel: typeof EventSessionsAssesmentsModel.DataModel;
    EventSessionAssesmentSubmissionsModel: typeof EventSessionAssesmentSubmissionsModel.DataModel;
    EventAttendanceModel: typeof EventAttendanceModel.DataModel;
    EventEnrollmentsModel: typeof EventEnrollmentsModel.DataModel;
    EventPaymentsModel: typeof EventPaymentsModel.DataModel;
    EventPaymentRefundsModel: typeof EventPaymentRefundsModel.DataModel;
    EventFeedbackFormFieldsModel: typeof EventFeedbackFormFieldsModel.DataModel;
    EventFeedbackFormFieldValuesModel: typeof EventFeedbackFormFieldValuesModel.DataModel;
    
    BlogModel: typeof BlogModel.DataModel;
    BlogCategoriesModel: typeof BlogCategoriesModel.DataModel;
    BlogCategoryBlogModel: typeof BlogCategoryBlogModel.DataModel;
    BlogTagsModel: typeof BlogTagsModel.DataModel;
    BlogTagBlogModel: typeof BlogTagBlogModel.DataModel;


    BlogCommentModel: typeof BlogCommentModel.DataModel;
    BlogCommentRepliesModel: typeof BlogCommentRepliesModel.DataModel;
    BlogLikeModel: typeof BlogLikeModel.DataModel;
    BlogViewModel: typeof BlogViewModel.DataModel;
   
    AuthorModel: typeof AuthorModel.DataModel;

    DonationModel: typeof DonationModel.DataModel;

    AppSettinsgModel: typeof AppSettingsModel.DataModel;
    AppSettingValuesModel: typeof AppSettingValuesModel.DataModel;
    AppSubscribersModel: typeof AppSubscribersModel.DataModel;
    
    UserModel: typeof UserModel.DataModel;
    UserRolesModel: typeof UserRolesModel.DataModel;
    UserLoginHistoriesModel: typeof UserLoginHistoriesModel.DataModel;

}
