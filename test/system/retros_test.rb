class RetrosTest < RetrobotSystemTestCase
  test "creating a retro and looking at summary" do
    visit '/'

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

    visit "/retro/#{r.key}"

    first('.js-test-delta-upvote').click()
    click_on(class: 'js-test-lock')

    first('.js-test-delta-notes').click()
    fill_in "Enter notes, action items...", with: "some notes are good"
    sleep(1)
    find('.js-test-save-notes').click()
    first('.js-test-delta-notes').click()
    assert_selector ".js-test-notes-input", text: "some notes are good"

    # test the prev delta dialog
    visit '/'
    fill_in "Team name (optional)", with: "test team"
    fill_in "Password (optional)", with: "testpassword"
    click_on "Start"

    assert_selector '.js-test-prev-deltas-modal'
    first('.js-test-prev-delta-check').click()
    click_on "Add these deltas"
    assert_selector ".js-test-delta"

    # test summary
    visit '/summary/test team'
    find('.form-control', wait: 10)
    fill_in "Password", with: "testpassword"
    click_on "Get summary"
    assert_selector ".js-test-delta-summary-content", text: "this my delta, so COOL!"
    assert_selector ".js-test-delta-summary-votes", text: "1 vote"
  end

  test "temperature check" do
    visit '/'
    check 'Include temperature check'
    click_on 'Start'
    assert_selector '.js-test-temp-check-modal'
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
