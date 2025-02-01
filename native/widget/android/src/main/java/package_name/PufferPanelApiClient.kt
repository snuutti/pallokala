package package_name

import package_name.dto.*
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.cookies.HttpCookies
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

class PufferPanelApiClient(private val baseUrl: String) {

    private val client = HttpClient(OkHttp) {
        install(HttpCookies)
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
            })
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

}