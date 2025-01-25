package package_name

import android.content.Context
import android.widget.RemoteViews
import android.widget.RemoteViewsService

class ServerListRemoteViewsFactory(private val context: Context): RemoteViewsService.RemoteViewsFactory {

    private val serverList = mutableListOf<Server>();

    override fun onCreate() {
        serverList.add(Server("1", "Server 1", ServerStatus.INSTALLING, 10.0f, 0.0f))
        serverList.add(Server("2", "Server 2", ServerStatus.ONLINE, 100.0f, 69.0f))
        serverList.add(Server("3", "Server 3", ServerStatus.OFFLINE, 0.0f, 0.0f))
        serverList.add(Server("4", "Server 4", ServerStatus.OFFLINE, 0.0f, 0.0f))
        serverList.add(Server("5", "Server 5", ServerStatus.ONLINE, 100.0f, 420.0f))
    }

    override fun onDataSetChanged() {
    }

    override fun onDestroy() {
    }

    override fun getCount(): Int {
        return serverList.size
    }

    override fun getViewAt(position: Int): RemoteViews {
        val server = serverList[position]

        val views = RemoteViews(context.packageName, R.layout.server_entry)
        views.setTextViewText(R.id.server_name, server.name)
        views.setTextViewText(R.id.server_details, "CPU: ${server.cpu}% | RAM: ${server.memory}%")
        views.setImageViewResource(R.id.server_status,
            when (server.status) {
                ServerStatus.INSTALLING -> R.drawable.pk_package_down
                ServerStatus.ONLINE -> R.drawable.pk_play_circle
                ServerStatus.OFFLINE -> R.drawable.pk_stop_circle
            }
        )

        return views
    }

    override fun getLoadingView(): RemoteViews? {
        return null
    }

    override fun getViewTypeCount(): Int {
        return 1
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun hasStableIds(): Boolean {
        return true
    }

}