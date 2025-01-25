package package_name

import android.content.Intent
import android.widget.RemoteViewsService

class ServerListService : RemoteViewsService() {

    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory {
        return ServerListRemoteViewsFactory(applicationContext)
    }

}