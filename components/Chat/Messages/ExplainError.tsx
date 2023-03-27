import { CustomLink } from '@/components/common/CustomLink'

import { UiMessage } from './types'

/**
 * Render an Explanation if `message` contains an error.
 * Renders nothing otherwise.
 */
export function ExplainError({ text, model }: UiMessage) {
  if (text.startsWith('OpenAI API error: 429 Too Many Requests')) {
    // TODO: retry at the api/chat level a few times instead of showing this error
    return (
      <>
        The model appears to be occupied at the moment. Kindly select <b>GPT-3.5 Turbo</b> via
        settings icon, or give it another go by selecting <b>Run again</b> from the message menu.
      </>
    )
  } else if (text.includes('"model_not_found"')) {
    // note that "model_not_found" is different than "The model `gpt-xyz` does not exist" message
    return (
      <>
        Your API key appears to be unauthorized for {model || 'this model'}. You can change to{' '}
        <b>GPT-3.5 Turbo</b> via the settings icon and simultaneously{' '}
        <CustomLink href="https://openai.com/waitlist/gpt-4-api" target="_blank">
          request access
        </CustomLink>{' '}
        to the desired model.
      </>
    )
  } else if (text.includes('"context_length_exceeded"')) {
    // TODO: propose to summarize or split the input?
    const pattern: RegExp = /maximum context length is (\d+) tokens.+resulted in (\d+) tokens/
    const match = pattern.exec(text)
    const usedText = match ? ` (${match[2]} tokens, max ${match[1]})` : ''

    return (
      <>
        This thread <b>surpasses the maximum size</b> allowed for {model || 'this model'}
        {usedText}. Please consider removing some earlier messages from the conversation, start a
        new conversation, choose a model with larger context, or submit a shorter new message.
      </>
    )
  }

  return null
}
