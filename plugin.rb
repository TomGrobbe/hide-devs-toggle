# name: hide-pizza
# about: Hide pizzas discourse plugin.
# version: 0.0.1
# authors: Tom Grobbe

enabled_site_setting :hide_devs_enabled

require_dependency 'post_creator'
require_dependency 'topic_creator'

after_initialize do
	hide = Group.find_by name: 'hide'
	pizzaGroup = Group.find_by name: 'Pizza'

	module ::HidePizza; end

	module ::HidePizza::WebHookTopicViewSerializerExtensions
		def include_post_stream?
			true
		end
	end

	module ::HidePizza::PostCreatorExtensions
		def initialize(user, opts)
			hide = Group.find_by name: 'hide'
			pizzaGroup = Group.find_by name: 'Pizza'

			super

			@user = pizzaGroup.users.sample if user.group_ids.include? hide.id
		end
	end

	class ::PostCreator
		prepend ::HidePizza::PostCreatorExtensions
	end

	class ::WebHookTopicViewSerializer
		prepend ::HidePizza::WebHookTopicViewSerializerExtensions
	end

	DiscourseEvent.on(:post_created) do |post, opts, user|
		next unless user.group_ids.include? hide.id
		if SiteSetting.hide_devs_enabled
			PostOwnerChanger.new( post_ids: [post.id],
					topic_id: post.topic_id,
					new_owner: pizzaGroup.users.sample,
					acting_user: pizzaGroup.users.sample,
					skip_revision: false ).change_owner!
		end
	end
end