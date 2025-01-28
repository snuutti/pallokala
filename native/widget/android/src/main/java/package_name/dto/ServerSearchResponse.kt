package package_name

import kotlinx.serialization.Serializable

@Serializable
data class ServerSearchResponse(val servers: List<ServerView>, val paging: Paging)