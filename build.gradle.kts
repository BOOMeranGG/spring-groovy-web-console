import io.gitlab.arturbosch.detekt.Detekt

val springBootVersion: String by project
val groovyVersion: String by project
val logbackVersion: String by project

plugins {
    kotlin("jvm") version "2.1.20"
    id("org.springframework.boot") version "3.5.0" apply false
    id("io.spring.dependency-management") version "1.1.7"
    id("maven-publish")
    id("io.gitlab.arturbosch.detekt") version "1.23.8"
}

dependencyManagement {
    imports {
        mavenBom("org.springframework.boot:spring-boot-dependencies:$springBootVersion")
    }
}

group = "com.boomerangg.spring-groovy-web-console"
version = "0.1-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.apache.groovy:groovy-all:$groovyVersion")
    implementation("ch.qos.logback:logback-classic:$logbackVersion")

    testImplementation(kotlin("test"))
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(17)
}

tasks.register<Detekt>("detektAll") {
    description = "Runs all the detekt checks"
    group = JavaBasePlugin.VERIFICATION_GROUP
    dependsOn(
        getTasksByName("detekt", true),
        getTasksByName("detektMain", true),
        getTasksByName("detektTest", true),
    )
}

configurations
    .matching { it.name.startsWith("detekt") }
    .all {
        resolutionStrategy.eachDependency {
            if (requested.group == "org.jetbrains.kotlin") {
                useVersion("2.0.21")
                because("detekt 1.23.8 compiled with Kotlin 2.0.21")
            }
        }
    }

publishing {
    publications {
        register<MavenPublication>("gpr") {
            from(components["java"])

            groupId = "com.boomerangg"
            artifactId = "spring-groovy-web-console"
            version = "0.1"
        }
    }
}
