package package_name

import android.content.Context
import android.content.SharedPreferences
import expo.modules.core.ModuleRegistry
import expo.modules.securestore.AuthenticationHelper
import expo.modules.securestore.SecureStoreOptions
import expo.modules.securestore.encryptors.AESEncryptor
import kotlinx.serialization.json.Json
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.polymorphic
import org.json.JSONException
import org.json.JSONObject
import java.security.KeyStore

class AccountStore {

    private val aesEncryptor = AESEncryptor()

    private val keyStore = KeyStore.getInstance("AndroidKeyStore")

    private val json = Json {
        ignoreUnknownKeys = true
        classDiscriminator = "type"
        serializersModule = SerializersModule {
            polymorphic(BaseAccount::class) {
                subclass(OAuthAccount::class, OAuthAccount.serializer())
                subclass(EmailAccount::class, EmailAccount.serializer())
            }
        }
    }

    private suspend fun getAccountKeys(context: Context): List<Int> {
        val key = "user_account_ids"
        val item = getItem(context, key) ?: return emptyList()

        return json.decodeFromString<List<Int>>(item)
    }

    suspend fun getAccounts(context: Context): List<BaseAccount> {
        val keys = getAccountKeys(context)
        return keys.mapNotNull { getAccount(context, it) }
    }

    suspend fun getAccount(context: Context, id: Int): BaseAccount? {
        val key = "user_account_$id"
        val item = getItem(context, key) ?: return null

        return json.decodeFromString<BaseAccount>(item)
    }

    private suspend fun getItem(context: Context, key: String): String? {
        val prefs = getSharedPreferences(context)
        val keychainAwareKey = createKeychainAwareKey(key)

        if (prefs.contains(keychainAwareKey)) {
            val authenticationHelper = AuthenticationHelper(context, ModuleRegistry(listOf(), listOf()))
            return readJSONEncodedItem(prefs, keychainAwareKey, authenticationHelper)
        }

        return null
    }

    private suspend fun readJSONEncodedItem(prefs: SharedPreferences, key: String, authenticationHelper: AuthenticationHelper): String? {
        val encryptedItemString = prefs.getString(key, null) ?: return null

        val encryptedItem = try {
            JSONObject(encryptedItemString)
        } catch (e: JSONException) {
            e.printStackTrace()
            return null
        }

        val secretKeyEntry = getKeyEntry() ?: return null
        return aesEncryptor.decryptItem(key, encryptedItem, secretKeyEntry, SecureStoreOptions(), authenticationHelper)
    }

    private fun getKeyEntry(): KeyStore.SecretKeyEntry? {
        keyStore.load(null)

        val keystoreAlias = aesEncryptor.getExtendedKeyStoreAlias(SecureStoreOptions(), false)
        return if (keyStore.containsAlias(keystoreAlias)) {
            val entry = keyStore.getEntry(keystoreAlias, null)
            if (entry is KeyStore.SecretKeyEntry) {
                entry
            } else {
                null
            }
        } else {
            null
        }
    }

    private fun getSharedPreferences(context: Context): SharedPreferences {
        return context.getSharedPreferences("SecureStore", Context.MODE_PRIVATE)
    }

    private fun createKeychainAwareKey(key: String): String {
        return "key_v1-$key"
    }

}