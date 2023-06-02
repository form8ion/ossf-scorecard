Feature: Scaffolder

  Scenario: Scaffold
    Given the project is hosted on "GitHub"
    When the project is scaffolded
    Then the score badge is added to the status zone
