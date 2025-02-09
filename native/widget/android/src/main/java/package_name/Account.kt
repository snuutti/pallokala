package package_name

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
sealed class BaseAccount {
    abstract val id: Int?
    abstract val serverAddress: String
    abstract val nickname: String
}

@Serializable
@SerialName("oauth")
data class OAuthAccount(
    override val id: Int? = null,
    override val serverAddress: String,
    override val nickname: String,
    val clientId: String,
    val clientSecret: String
) : BaseAccount()

@Serializable
@SerialName("email")
data class EmailAccount(
    override val id: Int? = null,
    override val serverAddress: String,
    override val nickname: String,
    val email: String,
    val password: String,
    val otpSecret: String? = null
) : BaseAccount()