package package_name

import package_name.dto.*
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.HttpClientPlugin
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.cookies.HttpCookies
import io.ktor.client.request.HttpRequestPipeline
import io.ktor.client.request.forms.submitForm
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.Parameters
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import io.ktor.util.AttributeKey
import kotlinx.serialization.json.Json

class PufferPanelApiClient(private val baseUrl: String) {

    private var accessToken: String? = null

    private val client = HttpClient(OkHttp) {
        install(HttpCookies)
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
            })
        }
        install(OAuthTokenInjection) {
            getToken = { accessToken }
        }
    }

    suspend fun login(email: String, password: String): Boolean = try {
        val response = client.post("$baseUrl/auth/login") {
            contentType(ContentType.Application.Json)
            setBody(mapOf("email" to email, "password" to password))
        }

        response.headers["Set-Cookie"]?.contains("puffer_auth") ?: false
    } catch (e: Exception) {
        e.printStackTrace()
        false
    }

    suspend fun oauth(clientId: String, clientSecret: String): Boolean = try {
        val response = client.submitForm(
            url = "$baseUrl/oauth2/token",
            formParameters = Parameters.build {
                append("grant_type", "client_credentials")
                append("client_id", clientId)
                append("client_secret", clientSecret)
            }
        )

        accessToken = response.body<OAuth2TokenResponse>().accessToken
        true
    } catch (e: Exception) {
        e.printStackTrace()
        false
    }

    suspend fun getServers(page: Int = 1): List<ServerView>? = try {
        client.get("$baseUrl/api/servers") {
            url {
                parameters.append("page", page.toString())
            }
        }.body<ServerSearchResponse>().servers
    } catch (e: Exception) {
        e.printStackTrace()
        null
    }

    suspend fun getServerStatus(serverId: String): ServerStatusResponse? = try {
        client.get("$baseUrl/api/servers/$serverId/status").body()
    } catch (e: Exception) {
        e.printStackTrace()
        null
    }

    suspend fun getServerStats(serverId: String): ServerStatsResponse? = try {
        client.get("$baseUrl/api/servers/$serverId/stats").body()
    } catch (e: Exception) {
        e.printStackTrace()
        null
    }

    class OAuthTokenInjection private constructor(config: Configuration) {

        private val getToken: () -> String? = config.getToken

        class Configuration {
            internal var getToken: () -> String? = { null }

            fun getToken(provider: () -> String?) {
                getToken = provider
            }
        }

        companion object Plugin : HttpClientPlugin<Configuration, OAuthTokenInjection> {
            override val key = AttributeKey<OAuthTokenInjection>("OAuthTokenInjection")

            override fun install(plugin: OAuthTokenInjection, scope: HttpClient) {
                scope.requestPipeline.intercept(HttpRequestPipeline.Before) {
                    val token = plugin.getToken()
                    if (!token.isNullOrBlank()) {
                        context.header("Authorization", "Bearer $token")
                    }
                }
            }

            override fun prepare(block: Configuration.() -> Unit) = OAuthTokenInjection(Configuration().apply(block))
        }

    }

}