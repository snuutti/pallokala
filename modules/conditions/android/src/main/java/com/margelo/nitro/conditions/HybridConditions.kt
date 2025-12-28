package com.margelo.nitro.conditions

import android.util.Log
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import dev.cel.bundle.CelFactory
import dev.cel.common.CelValidationException
import dev.cel.common.CelVarDecl
import dev.cel.common.types.SimpleType
import dev.cel.runtime.CelEvaluationException
import dev.cel.runtime.CelRuntimeFactory

@DoNotStrip
@Keep
class HybridConditions : HybridConditionsSpec() {

    override fun resolve(script: String, data: Map<String, VariableType>): Boolean {
        val varDecls = data.map { (key, value) ->
            when {
                value.isFirst -> CelVarDecl.newVarDeclaration(key, SimpleType.BOOL)
                value.isSecond -> CelVarDecl.newVarDeclaration(key, SimpleType.STRING)
                value.isThird -> CelVarDecl.newVarDeclaration(key, SimpleType.DOUBLE)
                else -> throw IllegalArgumentException("Unknown type for key $key")
            }
        }

        val variables = data.mapValues { (key, value) ->
            when {
                value.isFirst -> value.asFirstOrNull()!!
                value.isSecond -> value.asSecondOrNull()!!
                value.isThird -> value.asThirdOrNull()!!
                else -> throw IllegalArgumentException("Unknown type for key $key")
            }
        }

        val cel = CelFactory.standardCelBuilder()
            .addVarDeclarations(varDecls)
            .setResultType(SimpleType.BOOL)
            .build()

        val runtime = CelRuntimeFactory.standardCelRuntimeBuilder().build()

        try {
            val compileResult = cel.compile(script)
            val program = runtime.createProgram(compileResult.ast)
            return program.eval(variables) as Boolean
        } catch (e: CelValidationException) {
            Log.w("HybridConditions", "Error validating CEL program: $script", e)
            return false
        } catch (e: CelEvaluationException) {
            Log.w("HybridConditions", "Error evaluating CEL program: $script", e)
            return false
        } catch (e: ClassCastException) {
            Log.w("HybridConditions", "Error casting result of CEL program to bool: $script", e)
            return false
        }
    }

}
