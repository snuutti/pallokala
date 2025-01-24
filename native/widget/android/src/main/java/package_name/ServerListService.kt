package io.github.snuutti.pallokala.dev

import android.content.Intent
import android.widget.RemoteViewsService

class ServerListService : RemoteViewsService() {

    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory {
        return ServerListRemoteViewsFactory(applicationContext)
    }

}