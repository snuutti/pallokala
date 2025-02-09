package package_name.dto

import kotlinx.serialization.Serializable

@Serializable
data class LoginResponse(val otpNeeded: Boolean? = null)
