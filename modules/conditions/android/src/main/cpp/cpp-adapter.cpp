#include <jni.h>
#include "NitroConditionsOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::NitroConditions::initialize(vm);
}
