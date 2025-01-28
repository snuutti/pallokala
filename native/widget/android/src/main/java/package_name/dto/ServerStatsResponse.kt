package package_name

import kotlinx.serialization.Serializable

@Serializable
data class ServerStatsResponse(val cpu: Float, val memory: Float)