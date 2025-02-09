package package_name

import android.app.AlarmManager
import android.app.PendingIntent
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent

class AppWidgetAlarm<T : AppWidgetProvider>(
    private val context: Context,
    private val appWidgetProvider: Class<T>,
    private val alarmAction: String,
    private val alarmInterval: Long
) {

    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    fun startAlarm() {
        val intent = Intent(context, appWidgetProvider).apply {
            action = alarmAction
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        alarmManager.setRepeating(
            AlarmManager.RTC,
            System.currentTimeMillis(),
            alarmInterval,
            pendingIntent
        )
    }

    fun stopAlarm() {
        val intent = Intent(context, appWidgetProvider).apply {
            action = alarmAction
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        alarmManager.cancel(pendingIntent)
    }

}