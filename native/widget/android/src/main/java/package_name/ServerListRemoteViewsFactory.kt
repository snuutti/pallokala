package io.github.snuutti.pallokala.dev

import android.content.Context
import android.widget.RemoteViews
import android.widget.RemoteViewsService

class ServerListRemoteViewsFactory(private val context: Context): RemoteViewsService.RemoteViewsFactory {

    private val serverList = mutableListOf<String>();

    override fun onCreate() {
        serverList.add("Server 1")
        serverList.add("Server 2")
        serverList.add("Server 3")
        serverList.add("Server 4")
        serverList.add("Server 5")
    }

    override fun onDataSetChanged() {
    }

    override fun onDestroy() {
    }

    override fun getCount(): Int {
        return serverList.size
    }

    override fun getViewAt(position: Int): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.server_entry)
        views.setTextViewText(R.id.server_name, serverList[position])

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