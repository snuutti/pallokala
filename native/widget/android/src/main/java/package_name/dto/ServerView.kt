package package_name

import kotlinx.serialization.Serializable

@Serializable
data class ServerView(val id: String, val name: String, val canGetStatus: Boolean? = null)