class RetrosTest < RetrobotSystemTestCase
  test "creating a retro and looking at summary" do
    visit '/'

    fill_in "Team name (optional)", with: "test team"
    fill_in "Password (optional)", with: "testpassword"
    Percy.snapshot(page, { name: 'Create new retro', widths: [414, 1280] })
    click_on "Start"
    assert_selector ".js-test-send-delta-btn", text: "Delta"

    add_delta("this my delta, so COOL!")
    add_plus("this my plus, WOW")

    click_on "Start timer"
    assert_selector ".js-test-timer"

    add_delta("delta2")
    add_plus("plus2")

    Percy.snapshot(page, { name: 'During a retro - admin', widths: [414, 1280] })

    r = Retro.last
    r.status = 'voting'
    r.save

    visit "/retro/#{r.key}"

    first('.js-test-delta-upvote').click()
    click_on(class: 'js-test-lock')

    first('.js-test-delta-notes').click()
    fill_in "Enter notes, action items...", with: "some notes are good"
    Percy.snapshot(page, { name: 'Adding notes to a delta', widths: [414, 1280] })
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
    Percy.snapshot(page, { name: 'Previous deltas modal', widths: [414, 1280] })
    first('.js-test-prev-delta-check').click()
    click_on "Add these deltas"
    assert_selector ".js-test-delta"

    # test summary
    visit '/summary/test team'
    find('.form-control', wait: 10)
    fill_in "Password", with: "testpassword"
    click_on "Get summary"
    assert_selector ".js-test-delta-summary-content", text: "delta2"
    assert_selector ".js-test-delta-summary-votes", text: "1 vote"
    Percy.snapshot(page, { name: 'Team summary', widths: [414, 1280] })
  end

  test "temperature check" do
    visit '/'
    check 'Include temperature check'
    click_on 'Start'
    assert_selector '.js-test-temp-check-modal'
    Percy.snapshot(page, { name: 'Temperatur check modal', widths: [414, 1280] })
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
