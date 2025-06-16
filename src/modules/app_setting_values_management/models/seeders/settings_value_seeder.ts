'use strict';
import { InferCreationAttributes } from 'sequelize';
import db from '../db';
import { modelName, tableName } from '../app_setting_values.model';
import Models from '../../../../database/models';

/**
DB_HOST=localhost DB_PORT=3306 DB_USER=root DB_PASSWORD=123456 DB_DATABASE=iread npx ts-node src/modules/app_setting_management/models/seeders/settings_value_seeder.ts
*/

(async () => {
    let model = await db();

    console.log(`\nreseting ${tableName} table`);
    await model[modelName].destroy({ truncate: true });

    let model_data = new model[modelName]();
    let inputs= [

        {
            id: 1,
            title: "Site Name",
            type: "text",
            values: [
                {
                    app_setting_key_id: 1,
                    title: "Site Name",
                    value: "IREAD",
                    is_default: true,
                },
            ]
        },
        {
            id: 2,
            title: "Logo",
            type: "file",
            values: [
                {
                    app_setting_key_id: 2,
                    title: "Header Logo",
                    value: "logo/headerlogo.png",
                    is_default: true,
                },
                {
                    app_setting_key_id: 2,
                    title: "Footer Logo",
                    value: "logo/footerlogo.png",
                    is_default: true,
                },
                {
                    app_setting_key_id: 2,
                    title: "Logo on invoice",
                    value: "logo/invoice.png",
                    is_default: true,
                },
            ]
        },
        {
            id: 3,
            title: "Invoice",
            type: "text",
            values: [
                {
                    app_setting_key_id: 3,
                    title: "Site name on invoice",
                    value: "IREAD",
                    is_default: true,
                },
                {
                    app_setting_key_id: 3,
                    title: "Address on invoice",
                    value: "Callifornia, USA",
                    is_default: true,
                },
                {
                    app_setting_key_id: 3,
                    title: "Email on invoice",
                    value: "iread.hello@gmail.com",
                    is_default: true,
                },
                {
                    app_setting_key_id: 3,
                    title: "Phone on invoice",
                    value: "+880 134599677",
                    is_default: true,
                },
                {
                    app_setting_key_id: 3,
                    title: "Terms and conditions",
                    value: `
                    <ul>
                        <li>Terms 1</li>
                        <li>Terms 2</li>
                    </ul>
                    `,
                    is_default: true,
                },
                {
                    app_setting_key_id: 3,
                    title: "Gretting Message",
                    value: `Assalamu Alikum`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 3,
                    title: "Invoice Footer",
                    value: `Thank you.`,
                    is_default: true,
                },
            ]
        },
        {
            id: 4,
            title: "SEO",
            type: "text",
            values: [
                {
                    app_setting_key_id: 4,
                    title: "Site Title",
                    value: "IREAD | Online Training Platform - USA",
                    is_default: true,
                },
                {
                    app_setting_key_id: 4,
                    title: "Site short description (Max 100 characters)",
                    value: "Empower your career with IREAD, the USA's premier online training platform for skill development.",
                    is_default: true,
                },
            ]
        },
        {
            id: 5,
            title: "Header CSS",
            type: "text",
            values: [
                {
                    app_setting_key_id: 5,
                    title: "Header CSS",
                    value: `<style>.custom_class{font-size: 12px;}</style>`,
                    is_default: true,
                },
            ]
        },
        {
            id: 6,
            title: "Header JS",
            type: "text",
            values: [
                {
                    app_setting_key_id: 6,
                    title: "Header Js",
                    value: `<script>console.log('iread dynamic js')</script>`,
                    is_default: true,
                },
            ]
        },
        {
            id: 7,
            title: "Footer CSS",
            type: "text",
            values: [
                {
                    app_setting_key_id: 7,
                    title: "Header CSS",
                    value: `<style>.custom_class{font-size: 12px;}</style>`,
                    is_default: true,
                },
            ]
        },
        {
            id: 8,
            title: "Footer JS",
            type: "text",
            values: [
                {
                    app_setting_key_id: 8,
                    title: "Header Js",
                    value: `<script>console.log('iread dynamic js')</script>`,
                    is_default: true,
                },
            ]
        },
        {
            id: 9,
            title: "Social Links",
            type: "text",
            values: [
                {
                    app_setting_key_id: 9,
                    title: "Facebook",
                    value: "https://facebook.com/iread",
                    is_default: true,
                },
                {
                    app_setting_key_id: 9,
                    title: "Twitter",
                    value: "https://twitter.com/iread",
                    is_default: true,
                },
                {
                    app_setting_key_id: 9,
                    title: "Instagram",
                    value: "https://instagram.com/iread",
                    is_default: true,
                },
                {
                    app_setting_key_id: 9,
                    title: "LinkedIn",
                    value: "https://linkedin.com/company/iread",
                    is_default: true,
                },
                {
                    app_setting_key_id: 9,
                    title: "YouTube",
                    value: "https://youtube.com/c/iread",
                    is_default: true,
                },
                {
                    app_setting_key_id: 9,
                    title: "Pinterest",
                    value: "https://pinterest.com/iread",
                    is_default: true,
                },
                {
                    app_setting_key_id: 9,
                    title: "TikTok",
                    value: "https://tiktok.com/@iread",
                    is_default: true,
                },
                {
                    app_setting_key_id: 9,
                    title: "GitHub",
                    value: "https://github.com/iread",
                    is_default: false, // Optional platform, set as non-default
                },
            ],
        },
        {
            id: 10,
            title: "Contact Info",
            type: "text",
            values: [
                {
                    app_setting_key_id: 10,
                    title: "Contact phone1",
                    value: `+88012483953`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 10,
                    title: "Contact phone2",
                    value: `+8801583953`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 10,
                    title: "Contact phone3",
                    value: `+8801273953`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 10,
                    title: "WhatsApp",
                    value: `+8801273953`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 10,
                    title: "Telegram",
                    value: `+8801273953`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 10,
                    title: "Contact email1",
                    value: `iread.hello@gmail.com`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 10,
                    title: "Contact email2",
                    value: `iread.support@gmail.com`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 10,
                    title: "Contact email3",
                    value: `iread.hotline@gmail.com`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 10,
                    title: "Contact address",
                    value: `121 King Street, USA`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 10,
                    title: "Greeting title",
                    value: `We’d love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out.`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 10,
                    title: "Default reply subject",
                    value: `Thank You for Reaching Out to IREAD!`,
                    is_default: true,
                },
                {
                    app_setting_key_id: 10,
                    title: "Default email body",
                    value: `,

                        Thank you for contacting IREAD! We have received your inquiry and will get back to you shortly.  
                        If you have any urgent concerns, please feel free to reply to this email.  

                        Best regards,  
                        The IREAD Team  
                        iread.hello@gmail.com `,
                    is_default: true,
                },
            ]
        },
        {
            id: 11,
            title: "Email (smtp)",
            type: "text",
            values: [
                {
                    app_setting_key_id: 11,
                    title: "SMTP Host",
                    value: "smtp.gmail.com", // SMTP server host
                    is_default: true,
                },
                {
                    app_setting_key_id: 11,
                    title: "SMTP Port",
                    value: "587", // Port for TLS
                    is_default: true,
                },
                {
                    app_setting_key_id: 11,
                    title: "SMTP User",
                    value: "iread.hello@gmail.com", // SMTP login email
                    is_default: true,
                },
                {
                    app_setting_key_id: 11,
                    title: "SMTP Password",
                    value: "your-email-password", // SMTP password (should be stored securely)
                    is_default: false, // Avoid making sensitive information default
                },
                {
                    app_setting_key_id: 11,
                    title: "SMTP From Name",
                    value: "IREAD Support", // Sender name displayed in emails
                    is_default: true,
                },
                {
                    app_setting_key_id: 11,
                    title: "SMTP From Email",
                    value: "support@iread.com", // Sender email displayed in emails
                    is_default: true,
                },
                {
                    app_setting_key_id: 11,
                    title: "SMTP Secure",
                    value: "true", // Enable secure connection (SSL/TLS)
                    is_default: true,
                },
                {
                    app_setting_key_id: 11,
                    title: "Header Js",
                    value: `console.log('iread dynamic js')`, // Dynamic JavaScript example
                    is_default: true,
                },
            ],

        },
        {
            id: 12,
            title: "SMS (twilo)",
            type: "text",
            values: [
                {
                    app_setting_key_id: 12,
                    title: "Twilio Account SID",
                    value: "your-account-sid", // Twilio Account SID
                    is_default: true,
                },
                {
                    app_setting_key_id: 12,
                    title: "Twilio Auth Token",
                    value: "your-auth-token", // Twilio Authentication Token
                    is_default: false, // Sensitive, avoid making it default
                },
                {
                    app_setting_key_id: 12,
                    title: "Twilio Phone Number",
                    value: "+1234567890", // Twilio phone number (E.164 format)
                    is_default: true,
                },
                {
                    app_setting_key_id: 12,
                    title: "Twilio Messaging Service SID",
                    value: "your-messaging-service-sid", // Optional: For messaging service integration
                    is_default: false, // Optional, not default
                },
                {
                    app_setting_key_id: 12,
                    title: "Enable Twilio",
                    value: "true", // Toggle to enable or disable Twilio integration
                    is_default: true,
                },
            ],
        },
        {
            id: 13,
            title: "Stripe",
            type: "text",
            values: [
                {
                    app_setting_key_id: 13,
                    title: "Stripe API Key",
                    value: "your-stripe-api-key", // Your Stripe API key (secret key)
                    is_default: true,
                },
                {
                    app_setting_key_id: 13,
                    title: "Stripe Publishable Key",
                    value: "your-stripe-publishable-key", // Your Stripe publishable key
                    is_default: true,
                },
                {
                    app_setting_key_id: 13,
                    title: "Stripe Webhook Secret",
                    value: "your-stripe-webhook-secret", // Webhook secret for Stripe events
                    is_default: false, // Webhook secret is sensitive, avoid default
                },
                {
                    app_setting_key_id: 13,
                    title: "Stripe Currency",
                    value: "usd", // Default currency for Stripe transactions
                    is_default: true,
                },
                {
                    app_setting_key_id: 13,
                    title: "Enable Stripe Payments",
                    value: "true", // Toggle to enable or disable Stripe payments
                    is_default: true,
                },
            ],
        },
        {
            id: 14,
            title: "Facebook messenger api",
            type: "text",
            values: [
                {
                    app_setting_key_id: 14,
                    title: "Facebook messenger api",
                    value: "",
                    is_default: true,
                },

            ],
        },
        {
            id: 15,
            title: "Facebook Piexels",
            type: "text",
            values: [
                {
                    app_setting_key_id: 15,
                    title: "Facebook Pixel ID",
                    value: "your-facebook-pixel-id", // Your unique Facebook Pixel ID
                    is_default: true,
                },
                {
                    app_setting_key_id: 15,
                    title: "Enable Facebook Pixel",
                    value: "true", // Toggle to enable or disable Facebook Pixel
                    is_default: true,
                },
                {
                    app_setting_key_id: 15,
                    title: "Facebook Pixel Script",
                    value: `
                        <!-- Facebook Pixel Code -->
                        <script>
                          !function(f,b,e,v,n,t,s)
                          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                          n.queue=[];t=b.createElement(e);t.async=!0;
                          t.src=v;s=b.getElementsByTagName(e)[0];
                          s.parentNode.insertBefore(t,s)}(window, document,'script',
                          'https://connect.facebook.net/en_US/fbevents.js');
                          fbq('init', 'your-facebook-pixel-id'); 
                          fbq('track', 'PageView');
                        </script>
                        <noscript><img height="1" width="1" style="display:none"
                          src="https://www.facebook.com/tr?id=your-facebook-pixel-id&ev=PageView&noscript=1"
                        /></noscript>
                        <!-- End Facebook Pixel Code -->
                    `,
                    is_default: true,
                },
            ],
        },
        {
            id: 16,
            title: "Google Analytics",
            type: "text",
            values: [
                {
                    app_setting_key_id: 16,
                    title: "Google Analytics Tracking ID",
                    value: "UA-XXXXXXXXX-X", // Replace with your actual Google Analytics Tracking ID
                    is_default: true,
                },
                {
                    app_setting_key_id: 16,
                    title: "Enable Google Analytics",
                    value: "true", // Toggle to enable or disable Google Analytics
                    is_default: true,
                },
                {
                    app_setting_key_id: 16,
                    title: "Google Analytics Script",
                    value: `
                        <!-- Google Analytics -->
                        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX-X"></script>
                        <script>
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', 'UA-XXXXXXXXX-X');
                        </script>
                        <!-- End Google Analytics -->
                    `,
                    is_default: true,
                },
            ],
        },
        {
            id: 17,
            title: "Telegram Bot API",
            type: "text",
            values: [
                {
                    app_setting_key_id: 17,
                    title: "Telegram Bot API",
                    value: "7312597411:AAGhNbnk3ePCdA1qGj84TUgIGSdpc8gOLjE",
                    is_default: true,
                },
                {
                    app_setting_key_id: 17,
                    title: "Message Reciver id 1",
                    value: "1728513299",
                    is_default: true,
                },
                {
                    app_setting_key_id: 17,
                    title: "Message Reciver id 2",
                    value: "1728513299",
                    is_default: true,
                },
                {
                    app_setting_key_id: 17,
                    title: "Message Reciver id 3",
                    value: "1728513299",
                    is_default: true,
                },
                {
                    app_setting_key_id: 17,
                    title: "Message Reciver id 4",
                    value: "1728513299",
                    is_default: true,
                },

            ],
        },
    ];

    for (let i = 0; i < inputs.length; i++) {
        let values = (inputs[i] as any).values;
        for (let j = 0; j < values.length; j++) {
            await model[modelName].create(values[j]);
        }
    }
    
    console.log('\nmigrating data');

    console.log('\nmigration complete');
    await model.sequelize.close();

})();

