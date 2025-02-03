package package_name.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class OAuth2TokenResponse(@SerialName("access_token") val accessToken: String)
