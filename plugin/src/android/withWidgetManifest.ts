import { ConfigPlugin, AndroidConfig, withAndroidManifest } from "@expo/config-plugins";

export const withWidgetManifest: ConfigPlugin = (config) => {
    return withAndroidManifest(config, (newConfig) => {
        const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(newConfig.modResults);
        const widgetReceivers = buildWidgetReceivers();
        const widgetServices = buildWidgetServices();
        mainApplication.receiver = [...(mainApplication.receiver || []), ...widgetReceivers];
        mainApplication.service = [...(mainApplication.service || []), ...widgetServices];

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