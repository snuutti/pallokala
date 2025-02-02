import { ConfigPlugin, AndroidConfig, withAndroidManifest } from "@expo/config-plugins";
import { ManifestActivity } from "@expo/config-plugins/build/android/Manifest";

export const withWidgetManifest: ConfigPlugin = (config) => {
    return withAndroidManifest(config, (newConfig) => {
        const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(newConfig.modResults);
        const widgetReceivers = buildWidgetReceivers();
        const widgetServices = buildWidgetServices();
        const widgetActivities = buildWidgetActivities();
        mainApplication.receiver = [...(mainApplication.receiver || []), ...widgetReceivers];
        mainApplication.service = [...(mainApplication.service || []), ...widgetServices];
        mainApplication.activity = [...(mainApplication.activity || []), ...widgetActivities];

        return newConfig;
    });
};

function buildWidgetReceivers() {
    return [
        {
            $: {
                "android:name": ".ServerListWidget",
                "android:exported": "false" as const
            },
            "intent-filter": [
                {
                    action: [
                        {
                            $: {
                                "android:name": "android.appwidget.action.APPWIDGET_UPDATE"
                            }
                        }
                    ]
                }
            ],
            "meta-data": [
                {
                    $: {
                        "android:name": "android.appwidget.provider",
                        "android:resource": "@xml/server_list_widget_info"
                    }
                }
            ]
        }
    ];
}

function buildWidgetServices() {
    return [
        {
            $: {
                "android:name": ".ServerListService",
                "android:exported": "false" as const,
                "android:permission": "android.permission.BIND_REMOTEVIEWS"
            }
        }
    ];
}

function buildWidgetActivities(): ManifestActivity[] {
    return [
        {
            $: {
                "android:name": ".ServerListWidgetConfigurationActivity",
                "android:exported": "false" as const
            },
            "intent-filter": [
                {
                    action: [
                        {
                            $: {
                                "android:name": "android.appwidget.action.APPWIDGET_CONFIGURE"
                            }
                        }
                    ]
                }
            ]
        }
    ];
}