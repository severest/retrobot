require "application_system_test_case"

class RetrosTest < ApplicationSystemTestCase
  def teardown
    errors = page.driver.browser.manage.logs.get(:browser)
    if errors.present?
      message = errors.map(&:message).join("\n")
      puts message
    end
    assert !errors.present?
  end

  test "visiting the index" do
    if !ENV['LOCAL_TESTING'].nil?
      visit 'http://localhost:8080'
    else
      visit '/'
    end

    fill_in "Team name (optional)", with: "test team"
    fill_in "Password (optional)", with: "testpassword"
    click_on "Start"
    assert_selector ".js-test-send-delta-btn", text: "Delta"

    add_delta("this my delta, so COOL!")
    add_plus("this my plus, WOW")

    click_on "Start timer"
    assert_selector ".js-test-timer"

    add_delta("delta2")
    add_plus("plus2")

    r = Retro.last
    r.status = 'voting'
    r.save

    if !ENV['LOCAL_TESTING'].nil?
      visit "http://localhost:8080/retro/#{r.key}"
    else
      visit "/retro/#{r.key}"
    end

    click_on(class: 'js-test-lock')
  end

  def add_delta(text)
    find('.form-control').set(text)
    click_on "Delta"
    assert_selector ".js-test-delta", text: text
  end

  def add_plus(text)
    find('.form-control').set(text)
    click_on "Plus"
    assert_selector ".js-test-plus", text: text
  end
end
