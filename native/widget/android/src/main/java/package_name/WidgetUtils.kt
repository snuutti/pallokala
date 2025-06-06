package package_name

import java.text.DateFormat
import java.util.Date
import java.util.Locale

object WidgetUtils {

    fun formatMemory(bytes: Float): String {
        val units = arrayOf("B", "KiB", "MiB", "GiB", "TiB")
        var value = bytes
        var unitIndex = 0

        while (value >= 1024 && unitIndex < units.lastIndex) {
            value /= 1024
            unitIndex++
        }

        if (value == 0f) {
            return "0 B"
        }

        return String.format(Locale.ROOT, "%.1f %s", value, units[unitIndex])
    }

    fun formatDate(milliseconds: Long): String {
        val date = Date(milliseconds)
        val format = DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.MEDIUM)

        return format.format(date)
    }

}