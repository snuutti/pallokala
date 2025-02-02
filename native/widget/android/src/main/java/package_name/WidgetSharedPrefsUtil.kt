package package_name

import android.content.Context
import androidx.core.content.edit

object WidgetSharedPrefsUtil {

    private const val PREFS_NAME = "${BuildConfig.APPLICATION_ID}.ServerListWidget"

    private const val PREFS_PREFIX_KEY = "appwidget_"

    fun loadWidgetPrefs(context: Context, appWidgetId: Int): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, 0)
        return prefs.getInt(PREFS_PREFIX_KEY + appWidgetId, -1)
    }

    fun saveWidgetPrefs(context: Context, appWidgetId: Int, value: Int) {
        context.getSharedPreferences(PREFS_NAME, 0).edit {
            putInt(PREFS_PREFIX_KEY + appWidgetId, value)
        }
    }

    fun deleteWidgetPrefs(context: Context, appWidgetId: Int) {
        context.getSharedPreferences(PREFS_NAME, 0).edit {
            remove(PREFS_PREFIX_KEY + appWidgetId)
        }
    }

}