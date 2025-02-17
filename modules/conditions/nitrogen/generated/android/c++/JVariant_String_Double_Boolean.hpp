///
/// JVariant_String_Double_Boolean.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#include <fbjni/fbjni.h>
#include <variant>

namespace margelo::nitro::NitroConditions {

  using namespace facebook;

  /**
   * The C++ JNI bridge between the C++ std::variant and the Java class "Variant_String_Double_Boolean".
   */
  class JVariant_String_Double_Boolean: public jni::JavaClass<JVariant_String_Double_Boolean> {
  public:
    static auto constexpr kJavaDescriptor = "Lcom/margelo/nitro/conditions/Variant_String_Double_Boolean;";

    static jni::local_ref<JVariant_String_Double_Boolean> create_0(jni::alias_ref<jni::JString> value) {
      static const auto method = javaClassStatic()->getStaticMethod<JVariant_String_Double_Boolean(jni::alias_ref<jni::JString>)>("create");
      return method(javaClassStatic(), value);
    }
    static jni::local_ref<JVariant_String_Double_Boolean> create_1(double value) {
      static const auto method = javaClassStatic()->getStaticMethod<JVariant_String_Double_Boolean(double)>("create");
      return method(javaClassStatic(), value);
    }
    static jni::local_ref<JVariant_String_Double_Boolean> create_2(jboolean value) {
      static const auto method = javaClassStatic()->getStaticMethod<JVariant_String_Double_Boolean(jboolean)>("create");
      return method(javaClassStatic(), value);
    }

    static jni::local_ref<JVariant_String_Double_Boolean> fromCpp(const std::variant<std::string, double, bool>& variant) {
      switch (variant.index()) {
        case 0: return create_0(jni::make_jstring(std::get<0>(variant)));
        case 1: return create_1(std::get<1>(variant));
        case 2: return create_2(std::get<2>(variant));
        default: throw std::invalid_argument("Variant holds unknown index! (" + std::to_string(variant.index()) + ")");
      }
    }

    [[nodiscard]] std::variant<std::string, double, bool> toCpp() const;
  };

  namespace JVariant_String_Double_Boolean_impl {
    class SomeString: public jni::JavaClass<SomeString, JVariant_String_Double_Boolean> {
    public:
      static auto constexpr kJavaDescriptor = "Lcom/margelo/nitro/conditions/Variant_String_Double_Boolean$SomeString;";
    
      [[nodiscard]] jni::local_ref<jni::JString> getValue() const {
        static const auto field = javaClassStatic()->getField<jni::JString>("value");
        return getFieldValue(field);
      }
    };
    
    class SomeDouble: public jni::JavaClass<SomeDouble, JVariant_String_Double_Boolean> {
    public:
      static auto constexpr kJavaDescriptor = "Lcom/margelo/nitro/conditions/Variant_String_Double_Boolean$SomeDouble;";
    
      [[nodiscard]] double getValue() const {
        static const auto field = javaClassStatic()->getField<double>("value");
        return getFieldValue(field);
      }
    };
    
    class SomeBoolean: public jni::JavaClass<SomeBoolean, JVariant_String_Double_Boolean> {
    public:
      static auto constexpr kJavaDescriptor = "Lcom/margelo/nitro/conditions/Variant_String_Double_Boolean$SomeBoolean;";
    
      [[nodiscard]] jboolean getValue() const {
        static const auto field = javaClassStatic()->getField<jboolean>("value");
        return getFieldValue(field);
      }
    };
  } // namespace JVariant_String_Double_Boolean_impl

  std::variant<std::string, double, bool> JVariant_String_Double_Boolean::toCpp() const {
    if (isInstanceOf(JVariant_String_Double_Boolean_impl::SomeString::javaClassStatic())) {
      auto jniValue = static_cast<const JVariant_String_Double_Boolean_impl::SomeString*>(this)->getValue();
      return jniValue->toStdString();
    } else if (isInstanceOf(JVariant_String_Double_Boolean_impl::SomeDouble::javaClassStatic())) {
      auto jniValue = static_cast<const JVariant_String_Double_Boolean_impl::SomeDouble*>(this)->getValue();
      return jniValue;
    } else if (isInstanceOf(JVariant_String_Double_Boolean_impl::SomeBoolean::javaClassStatic())) {
      auto jniValue = static_cast<const JVariant_String_Double_Boolean_impl::SomeBoolean*>(this)->getValue();
      return static_cast<bool>(jniValue);
    }
    throw std::invalid_argument("Variant is unknown Kotlin instance!");
  }

} // namespace margelo::nitro::NitroConditions
