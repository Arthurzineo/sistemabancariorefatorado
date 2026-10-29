package bdd;

import org.junit.runner.RunWith;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;

/**
 * Executa, via JUnit, todos os cenarios BDD escritos em
 * test/resources/features. Cada cenario aparece como um teste.
 */
@RunWith(Cucumber.class)
@CucumberOptions(
		features = "classpath:features",
		glue = "bdd",
		plugin = { "pretty", "summary" })
public class RunCucumberTest {
}
