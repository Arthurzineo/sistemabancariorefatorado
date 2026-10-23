package bdd

import (
 "testing"
 "github.com/cucumber/godog"
)

func TestFeatures(t *testing.T) {
 suite := godog.TestSuite{Name: "bancario", ScenarioInitializer: inicializarCenario, Options: &godog.Options{Format: "pretty", Paths: []string{"../../features"}, TestingT: t}}
 if suite.Run() != 0 { t.Fatal("cenarios BDD falharam") }
}
