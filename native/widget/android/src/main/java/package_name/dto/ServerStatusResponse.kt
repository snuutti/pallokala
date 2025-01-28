package package_name

import kotlinx.serialization.Serializable

@Serializable
data class ServerStatusResponse(val running: Boolean, val installing: Boolean)