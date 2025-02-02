package package_name

import android.appwidget.AppWidgetManager
import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.ListView
import androidx.appcompat.app.AppCompatActivity
import package_name.databinding.ServerListWidgetConfigureBinding
import kotlinx.coroutines.runBlocking

class ServerListWidgetConfigurationActivity : AppCompatActivity() {

    private var appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID

    private lateinit var binding: ServerListWidgetConfigureBinding

    private val accountStore = AccountStore()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val resultValue = Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
        setResult(RESULT_CANCELED, resultValue)

        binding = ServerListWidgetConfigureBinding.inflate(layoutInflater)
        setContentView(binding.root)

        appWidgetId = intent.extras?.getInt(
            AppWidgetManager.EXTRA_APPWIDGET_ID,
            AppWidgetManager.INVALID_APPWIDGET_ID
        ) ?: AppWidgetManager.INVALID_APPWIDGET_ID

        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish()
            return
        }

        val accountListView = binding.pickAccountList

        val accounts: List<BaseAccount>
        runBlocking {
            accounts = accountStore.getAccounts(this@ServerListWidgetConfigurationActivity)
        }

        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_list_item_single_choice,
            accounts.map { it.nickname }
        )
        accountListView.adapter = adapter
        accountListView.choiceMode = ListView.CHOICE_MODE_SINGLE

        accountListView.setOnItemClickListener { _, _, position, _ ->
            val selectedAccount = accounts[position]
            saveConfiguration(selectedAccount)
        }
    }

    private fun saveConfiguration(selectedAccount: BaseAccount) {
        WidgetSharedPrefsUtil.saveWidgetPrefs(this, appWidgetId, selectedAccount.id!!)
        ServerListWidget.refreshWidget(this, appWidgetId)

        val resultValue = Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
        setResult(RESULT_OK, resultValue)
        finish()
    }

}