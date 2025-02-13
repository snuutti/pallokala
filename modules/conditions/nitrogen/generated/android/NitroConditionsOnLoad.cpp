///
/// NitroConditionsOnLoad.cpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#ifndef BUILDING_NITROCONDITIONS_WITH_GENERATED_CMAKE_PROJECT
#error NitroConditionsOnLoad.cpp is not being built with the autogenerated CMakeLists.txt project. Is a different CMakeLists.txt building this?
#endif

#include "NitroConditionsOnLoad.hpp"

#include <jni.h>
#include <fbjni/fbjni.h>
#include <NitroModules/HybridObjectRegistry.hpp>

#include "JHybridConditionsSpec.hpp"
#include <NitroModules/JNISharedPtr.hpp>
#include <NitroModules/DefaultConstructableObject.hpp>

namespace margelo::nitro::NitroConditions {

int initialize(JavaVM* vm) {
  using namespace margelo::nitro;
  using namespace margelo::nitro::NitroConditions;
  using namespace facebook;

  return facebook::jni::initialize(vm, [] {
    // Register native JNI methods
    margelo::nitro::NitroConditions::JHybridConditionsSpec::registerNatives();

    // Register Nitro Hybrid Objects
    HybridObjectRegistry::registerHybridObjectConstructor(
      "Conditions",
      []() -> std::shared_ptr<HybridObject> {
        static DefaultConstructableObject<JHybridConditionsSpec::javaobject> object("com/margelo/nitro/conditions/HybridConditions");
        auto instance = object.create();
        auto globalRef = jni::make_global(instance);
        return JNISharedPtr::make_shared_from_jni<JHybridConditionsSpec>(globalRef);
      }
    );
  });
}

} // namespace margelo::nitro::NitroConditions
