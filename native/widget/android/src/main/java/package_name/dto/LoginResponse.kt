package package_name.dto

import kotlinx.serialization.Serializable

@Serializable
data class LoginResponse(val otpNeeded: Boolean? = null, val needsSecondFactor: Boolean? = null, val otpEnabled: Boolean? = null)
