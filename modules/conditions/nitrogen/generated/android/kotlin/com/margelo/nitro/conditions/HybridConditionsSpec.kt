///
/// HybridConditionsSpec.kt
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

package com.margelo.nitro.conditions

import androidx.annotation.Keep
import com.facebook.jni.HybridData
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.*

/**
 * A Kotlin class representing the Conditions HybridObject.
 * Implement this abstract class to create Kotlin-based instances of Conditions.
 */
@DoNotStrip
@Keep
@Suppress(
  "KotlinJniMissingFunction", "unused",
  "RedundantSuppression", "RedundantUnitReturnType", "SimpleRedundantLet",
  "LocalVariableName", "PropertyName", "PrivatePropertyName", "FunctionName"
)
abstract class HybridConditionsSpec: HybridObject() {
  @DoNotStrip
  private var mHybridData: HybridData = initHybrid()

  init {
    super.updateNative(mHybridData)
  }

  override fun updateNative(hybridData: HybridData) {
    mHybridData = hybridData
    super.updateNative(hybridData)
  }

  // Properties
  

  // Methods
  @DoNotStrip
  @Keep
  abstract fun resolve(script: String, data: Map<String, Variant_String_Double_Boolean>): Boolean

  private external fun initHybrid(): HybridData

  companion object {
    private const val TAG = "HybridConditionsSpec"
  }
}
