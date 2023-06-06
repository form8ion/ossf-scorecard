Feature: Scaffolder

  Scenario: Scaffold a GitHub project
    Given the project is hosted on "GitHub"
    When the project is scaffolded
    Then the score badge is added to the status zone
    And the workflow is defined

  Scenario: Scaffold a project hosted on a different VCS host
    Given the project is hosted on "Other"
    When the project is scaffolded
    Then no badge is added
    And the workflow is not defined
